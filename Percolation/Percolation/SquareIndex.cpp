#include "SquareIndex.h"

SquareIndex::SquareIndex(const int &y, const int &x) :
	Index(y, x)
{
}

SquareIndex::~SquareIndex()
{
}

std::vector<Index::Ptr> SquareIndex::neighbours(bool gravity)
{
	if (gravity)
		return{ left(), right(), bottom() };
	else
		return{ top(), left(), right(), bottom() };
}
