#pragma once

#include <cstdlib>
#include <vector>
#include <random>
#include <functional>
#include <algorithm>

class Grid
{
public:
	typedef std::vector<bool> Row;

	Grid(std::size_t width, std::size_t height, double probability);
	~Grid();

	bool percolate();
	void print() const;

private:
	void init();
	bool flow() const;

	std::mt19937 generator;
	std::bernoulli_distribution distribution;

	std::function<bool()> random;

	std::size_t width;
	std::size_t height;

	std::vector<Row> grid;
};

