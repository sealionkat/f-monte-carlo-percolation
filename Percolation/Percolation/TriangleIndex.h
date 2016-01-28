#pragma once

#include "Index.h"

class TriangleIndex :
	public Index
{
public:
	TriangleIndex(const int &y, const int &x);
	virtual ~TriangleIndex();

	virtual std::vector<Index::Ptr> neighbours(bool gravity = false);

private:
	Index::Ptr base() const { return std::make_shared<TriangleIndex>(y + baseDirection(), x); }
	Index::Ptr left() const { return std::make_shared<TriangleIndex>(y, x - 1); }
	Index::Ptr right() const { return std::make_shared<TriangleIndex>(y, x + 1); }

	int baseDirection() const { return (((x & 1) ^ (y & 1)) << 1) - 1; }
	virtual bool isBottom(std::size_t height) { return (y == height - 1) && (baseDirection() == 1); }
};

