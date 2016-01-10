#include "Grid.h"

#include <set>
#include <stack>
#include <iostream>

#include "Index.h"

Grid::Grid(std::size_t width, std::size_t height, double probability) :
	width(width),
	height(height),
	generator(std::random_device()()),
	distribution(probability),
	grid(height, Row(width, false))
{
	random = std::bind(distribution, std::ref(generator));
}

Grid::~Grid()
{
}

bool Grid::percolate()
{
	init();
	return flow();
}

void Grid::init()
{
	std::for_each(std::begin(grid), std::end(grid), [this](Row &r)
	{
		std::generate(std::begin(r), std::end(r), random);
	});
}

bool Grid::flow() const
{
	std::set<Index> checked;
	std::stack<Index> stack;

	int top_idx = 0;
	const Row& top = grid[0];
	for (bool value : top)
	{
		if (value)
		{
			stack.emplace(0, top_idx);
			checked.emplace(0, top_idx);
		}

		++top_idx;
	}

	while (!stack.empty())
	{
		Index item = stack.top();
		stack.pop();

		if (item.isBottom(height))
			return true;

		auto neighbours = item.neighbours();

		for (Index &n : neighbours)
		{
			if (n.checkRange(width, height) && !checked.count(n) && grid[n.getY()][n.getX()])
			{
				stack.push(n);
				checked.insert(n);
			}
		}
	}

	return false;
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