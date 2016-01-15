#include "Grid.h"

#include <stack>
#include <iostream>
#include <memory>

#include "IndexFactory.h"

Grid::Grid(std::size_t width, std::size_t height, double probability, GridType type, bool gravity) :
	width(width),
	height(height),
	generator(std::random_device()()),
	distribution(probability),
	grid(height, Row(width, false)),
	type(type),
	gravity(gravity)
{
	random = std::bind(distribution, std::ref(generator));
	comparator = [](const Index::Ptr &p1, const Index::Ptr &p2) { return *p1 < *p2; };
}

Grid::~Grid()
{
}

bool Grid::percolate()
{
	init();
	return flow();
}

Grid::Simulation Grid::simulate()
{
	std::vector<SimulationStep> steps;

	init();
	flow(&steps);

	return steps;
}

void Grid::init()
{
	std::for_each(std::begin(grid), std::end(grid), [this](Row &r)
	{
		std::generate(std::begin(r), std::end(r), random);
	});
}

bool Grid::flow(Simulation * const steps) const
{
	std::set <Index::Ptr, decltype(comparator)> checked(comparator);
	std::stack<Index::Ptr> stack;

	addStep(steps, checked);

	int top_idx = 0;
	const Row& top = grid[0];
	for (bool value : top)
	{
		if (value)
		{
			auto idx = IndexFactory::create(type, 0, top_idx);
			stack.push(idx);
			checked.insert(idx);

			addStep(steps, checked);
		}

		++top_idx;
	}

	while (!stack.empty())
	{
		auto item = stack.top();
		stack.pop();

		if (item->isBottom(height))
			return true;

		auto neighbours = item->neighbours(gravity);

		for (auto &n : neighbours)
		{
			if (n->checkRange(width, height) && !checked.count(n) && grid[n->getY()][n->getX()])
			{
				stack.push(n);
				checked.insert(n);

				addStep(steps, checked);
			}
		}
	}

	return false;
}

void Grid::addStep(Simulation * const simulation, const std::set<Index::Ptr, decltype(comparator)>& checked) const
{
	if (!simulation)
		return;

	simulation->emplace_back(height);

	SimulationStep &step = simulation->back();

	std::size_t x = 0;
	std::size_t y = 0;

	std::for_each(std::begin(grid), std::end(grid), [&, this](const Row &r)
	{
		step[y] = SimulationRow(width);

		SimulationRow &simulation_row = step[y];

		std::for_each(std::begin(r), std::end(r), [&, this](bool i)
		{
			if (i)
			{
				auto idx = IndexFactory::create(type, y, x);

				if(checked.count(idx))
					simulation_row[x] = 2;
				else
					simulation_row[x] = 1;
			}
			else
				simulation_row[x] = 0;

			++x;
		});

		++y;
		x = 0;
	});
}

void Grid::print() const
{
	std::for_each(std::begin(grid), std::end(grid), [](const Row &r)
	{
		std::for_each(std::begin(r), std::end(r), [](bool i)
		{
			std::cout << (i ? '*' : 'X');
		});

		std::cout << std::endl;
	});
}