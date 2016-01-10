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
	return{};
}