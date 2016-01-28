#pragma once

#include <cstdlib>
#include <vector>
#include <memory>

class Index
{
public:
	typedef std::shared_ptr<Index> Ptr;

	Index(const int &y, const int &x);
	virtual ~Index();

	int getX() const { return x; }
	int getY() const { return y; }

	virtual std::vector<Index::Ptr> neighbours(bool gravity = false) = 0;

	bool checkRange(std::size_t width, std::size_t height) 
	{ 
		return x >= 0 && y >= 0 && x < static_cast<int>(width) && y < static_cast<int>(height); 
	}

	virtual bool isBottom(std::size_t height) { return y == height - 1; }

	friend bool operator<(const Index &i1, const Index &i2);

protected:
	int x;
	int y;
};

