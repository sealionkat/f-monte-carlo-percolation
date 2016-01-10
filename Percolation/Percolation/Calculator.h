#pragma once

#include <cstdlib>

#include <boost\accumulators\accumulators.hpp>
#include <boost\accumulators\statistics\stats.hpp>
#include <boost\accumulators\statistics\mean.hpp>

#include "GridType.h"
#include "Grid.h"

class Calculator
{
public:
	Calculator(std::size_t width, std::size_t height, double probability, GridType type, bool gravity = false);
	~Calculator();

	double calculate(std::size_t steps);

private:
	Grid grid;
};

