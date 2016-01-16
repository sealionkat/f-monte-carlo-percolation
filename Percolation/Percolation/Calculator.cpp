#include "Calculator.h"

#include <rapidjson/document.h>
#include <rapidjson/stringbuffer.h>
#include <rapidjson/writer.h>

Calculator::Calculator(std::size_t width, std::size_t height, double probability, GridType type, bool gravity) :
	grid(width, height, probability, type, gravity)
{
}

Calculator::~Calculator()
{
}

std::string Calculator::calculate(std::size_t steps)
{
	using namespace boost::accumulators;
	using namespace rapidjson;

	accumulator_set<std::size_t, stats<tag::mean>> acc;

	while (steps-- != 0)
		acc(static_cast<std::size_t>(grid.percolate()));

	Document doc(kObjectType);

	doc.AddMember("data", mean(acc), doc.GetAllocator());

	StringBuffer buffer;
	Writer<StringBuffer> writer(buffer);
	doc.Accept(writer);

	return buffer.GetString();
}

std::string Calculator::simulate()
{
	using namespace rapidjson;

	const Grid::Simulation data = grid.simulate();

	Document doc(kObjectType);
	auto &allocator = doc.GetAllocator();

	Value simulation(kArrayType);

	for (const Grid::SimulationStep &step : data)
	{
		Value step_data(kArrayType);

		for (const Grid::SimulationRow &row : step)
		{
			Value row_value(kArrayType);

			for (const uint8_t &value : row)
			{
				row_value.PushBack(value, allocator);
			}

			step_data.PushBack(row_value, allocator);
		}

		simulation.PushBack(step_data, allocator);
	}

	doc.AddMember("data", simulation, doc.GetAllocator());

	StringBuffer buffer;
	Writer<StringBuffer> writer(buffer);
	doc.Accept(writer);

	return buffer.GetString();
}
