#include "Options.h"

#include <iostream>
#include <stdexcept>

#include "GridTypeTranslator.h"

Options::Options(int argc, char *argv[]) :
	argc(argc),
	argv(argv),
	desc("Options"),
	variables()
{
	namespace opts = boost::program_options;

	desc.add_options()
		("help", "Show help message")
		("width", opts::value<int>()->required(), "Grid width")
		("height", opts::value<int>()->required(), "Grid height")
		("probability", opts::value<double>()->required(), "Grid open state probability")
		("steps", opts::value<int>()->required(), "Number of steps of simulation")
		("grid-type", opts::value<std::string>()->required(), "Grid type (squares/triangles/hexagons")
		("gravity", "Enable gravity");
}

Options::~Options()
{
}

bool Options::parse()
{
	namespace opts = boost::program_options;

	try
	{
		opts::store(opts::parse_command_line(argc, argv, desc), variables);

		if (variables.count("help"))
		{
			std::cout << desc << std::endl;
			return false;
		}

		opts::notify(variables);

		if (variables["width"].as<int>() < 0)
			throw std::range_error("value of '--width' out of range");

		if (variables["height"].as<int>() < 0)
			throw std::range_error("value of '--height' out of range");

		if (variables["steps"].as<int>() < 0)
			throw std::range_error("value of '--steps' out of range");

		if (variables["probability"].as<double>() < 0.0 || variables["probability"].as<double>() > 1.0)
			throw std::range_error("value of '--width' out of range");

		GridTypeTranslator::fromString(variables["grid-type"].as<std::string>());
	}
	catch (std::exception& e)
	{
		std::cerr << "Error: " << e.what() << std::endl;
		std::cerr << "Try '--help' option." << std::endl;

		return false;
	}

	return true;
}

std::size_t Options::width()
{
	return static_cast<std::size_t>(variables["width"].as<int>());
}

std::size_t Options::height()
{
	return static_cast<std::size_t>(variables["height"].as<int>());
}

bool Options::gravity()
{
	return variables.count("gravity") != 0;
}

double Options::probability()
{
	return variables["probability"].as<double>();
}

GridType Options::type()
{
	return GridTypeTranslator::fromString(variables["grid-type"].as<std::string>());
}

std::size_t Options::steps()
{
	return static_cast<std::size_t>(variables["steps"].as<int>());
}
