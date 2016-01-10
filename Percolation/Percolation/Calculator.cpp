#include "Calculator.h"
#include <iostream>
Calculator::Calculator(std::size_t width, std::size_t height, double probability, GridType type, bool gravity) :
	grid(width, height, probability, type, gravity)
{
}

Calculator::~Calculator()
{
}

double Calculator::calculate(std::size_t steps)
{
	using namespace boost::accumulators;

	accumulator_set<std::size_t, stats<tag::mean>> acc;

	while (steps-- != 0)
		acc(static_cast<std::size_t>(grid.percolate()));

	return mean(acc);
}
