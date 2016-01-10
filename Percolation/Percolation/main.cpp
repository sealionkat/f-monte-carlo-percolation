#include <iostream>
#include "Grid.h"

int main()
{
	Grid grid(10, 10, 0.5);

	int n = 0;

	for (int i = 0; i < 1000; ++i)
	{
		if (grid.percolate())
			n++;
	}

	std::cout << n << std::endl;

	return 0;
}