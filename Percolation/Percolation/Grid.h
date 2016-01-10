#pragma once

#include <cstdlib>
#include <vector>
#include <random>
#include <functional>
#include <algorithm>

#include "Index.h"
#include "GridType.h"

class Grid
{
public:
	typedef std::vector<bool> Row;

	Grid(std::size_t width, std::size_t height, double probability, GridType type, bool gravity = false);
	~Grid();

	bool percolate();
	void print() const;

private:
	void init();
	bool flow() const;

	std::mt19937 generator;
	std::bernoulli_distribution distribution;

	std::function<bool()> random;
	std::function<bool(const Index::Ptr &p1, const Index::Ptr &p2)> comparator;

	std::size_t width;
	std::size_t height;

	std::vector<Row> grid;
	GridType type;
	bool gravity;
};

