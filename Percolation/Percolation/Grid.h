#pragma once

#include <cstdlib>
#include <vector>
#include <set>
#include <random>
#include <functional>
#include <algorithm>

#include "Index.h"
#include "GridType.h"

class Grid
{
public:
	typedef std::vector<bool> Row;

	typedef std::vector<uint8_t> SimulationRow;
	typedef std::vector<SimulationRow> SimulationStep;
	typedef std::vector<SimulationStep> Simulation;

	Grid(std::size_t width, std::size_t height, double probability, GridType type, bool gravity = false);
	~Grid();

	bool percolate();
	Simulation simulate();
	void print() const;

private:
	std::function<bool(const Index::Ptr &p1, const Index::Ptr &p2)> comparator;

	void init();
	bool flow(Simulation * const steps = nullptr) const;
	void addStep(Simulation * const simulation, const std::set <Index::Ptr, decltype(comparator)> &checked) const;

	std::mt19937 generator;
	std::bernoulli_distribution distribution;

	std::function<bool()> random;

	std::size_t width;
	std::size_t height;

	std::vector<Row> grid;
	GridType type;
	bool gravity;
};

