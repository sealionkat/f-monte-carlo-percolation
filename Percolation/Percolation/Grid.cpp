#include "Grid.h"

#include <set>
#include <stack>
#include <iostream>
#include <memory>

#include "Index.h"
#include "SquareIndex.h"
#include "TriangleIndex.h"

Grid::Grid(std::size_t width, std::size_t height, double probability) :
	width(width),
	height(height),
	generator(std::random_device()()),
	distribution(probability),
	grid(height, Row(width, false))
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

void Grid::init()
{
	std::for_each(std::begin(grid), std::end(grid), [this](Row &r)
	{
		std::generate(std::begin(r), std::end(r), random);
	});
}

bool Grid::flow() const
{
	std::set <Index::Ptr, decltype(comparator)> checked(comparator);
	std::stack<Index::Ptr> stack;

	int top_idx = 0;
	const Row& top = grid[0];
	for (bool value : top)
	{
		if (value)
		{
			stack.push(std::make_shared<SquareIndex>(0, top_idx));
			checked.insert(std::make_shared<SquareIndex>(0, top_idx));
		}

		++top_idx;
	}

	while (!stack.empty())
	{
		auto item = stack.top();
		stack.pop();

		if (item->isBottom(height))
			return true;

		auto neighbours = item->neighbours();

		for (auto &n : neighbours)
		{
			if (n->checkRange(width, height) && !checked.count(n) && grid[n->getY()][n->getX()])
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