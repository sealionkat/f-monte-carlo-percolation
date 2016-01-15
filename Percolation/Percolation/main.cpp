#include <iostream>


#include "Calculator.h"
#include "GridType.h"
#include "Options.h"

int main(int argc, char* argv[])
{
	Options options(argc, argv);

	if (options.parse())
	{
		Calculator calculator(options.width(), options.height(), options.probability(), options.type(), options.gravity());
		std::cout << (options.is_simulation() ? calculator.simulate() : calculator.calculate(options.steps())) << std::endl;
	}

	return 0;
}