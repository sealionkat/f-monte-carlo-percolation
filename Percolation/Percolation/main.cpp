#include <iostream>
#include "Grid.h"
#include "GridType.h"

int main()
{
	Grid grid(10, 10, 0.5, GridType::Squares);

	int n = 0;

	for (int i = 0; i < 1000 * 100; ++i)
	{
		if (grid.percolate())
			n++;
	}

	std::cout << n << std::endl;

	return 0;
}