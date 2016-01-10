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
		std::cout << calculator.calculate(options.steps()) * 100.0 << "%" << std::endl;
	}

	return 0;
}