#pragma once

#include <cstdlib>
#include <vector>

class Index
{
public:
	Index(const int &y, const int &x);
	~Index();

	int getX() const { return x; }
	int getY() const { return y; }

	std::vector<Index> neighbours()
	{
		return { top(), left(), right(), bottom() };
	}

	bool checkRange(std::size_t width, std::size_t height) 
	{ 
		return x >= 0 && y >= 0 && x < static_cast<int>(width) && y < static_cast<int>(height); 
	}

	bool isBottom(std::size_t height) { return y == height - 1; }

	friend bool operator<(const Index &i1, const Index &i2);

private:
	Index top() const { return Index(y - 1, x); }
	Index bottom() const { return Index(y + 1, x); }
	Index left() const { return Index(y, x - 1); }
	Index right() const { return Index(y, x + 1); }

	int x;
	int y;
};

