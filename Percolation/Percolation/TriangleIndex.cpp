#include "TriangleIndex.h"

TriangleIndex::TriangleIndex(const int &y, const int &x) :
	Index(y, x)
{
}

TriangleIndex::~TriangleIndex()
{
}

std::vector<Index::Ptr> TriangleIndex::neighbours(bool gravity)
{
	if (baseDirection() == 1)
		return{ left(), right(), base() };

	if (gravity)
		return{ left(), right() };
	else
		return{ base(), left(), right() };
}