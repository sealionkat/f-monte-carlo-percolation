#pragma once

#include "Index.h"

class SquareIndex :
	public Index
{
public:
	SquareIndex(const int &y, const int &x);
	virtual ~SquareIndex();

	virtual std::vector<Index::Ptr> neighbours(bool gravity = false);

private:
	Index::Ptr top() const { return std::make_shared<SquareIndex>(y - 1, x); }
	Index::Ptr bottom() const { return std::make_shared<SquareIndex>(y + 1, x); }
	Index::Ptr left() const { return std::make_shared<SquareIndex>(y, x - 1); }
	Index::Ptr right() const { return std::make_shared<SquareIndex>(y, x + 1); }
};

