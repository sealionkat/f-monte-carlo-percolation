#include <iostream>

#include "Calculator.h"
#include "GridType.h"

int main()
{
	Calculator calculator(10, 10, 0.5, GridType::Squares, false);

	std::cout << calculator.calculate(1000) * 100.0 << "%" << std::endl;

	return 0;
}