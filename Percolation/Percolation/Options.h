#pragma once

#include <cstdlib>

#include <boost/program_options.hpp>

#include "GridType.h"

class Options
{
public:
	Options(int argc, char *argv[]);
	~Options();
	bool parse();

	std::size_t width();
	std::size_t height();
	bool gravity();
	double probability();
	GridType type();
	std::size_t steps();
	bool is_simulation();

private:
	const int argc;
	const char* const * argv;

	boost::program_options::options_description desc;
	boost::program_options::variables_map variables;
};

