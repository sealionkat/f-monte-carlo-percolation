#include "HexagonIndex.h"

HexagonIndex::HexagonIndex(const int &y, const int &x) :
	Index(y, x)
{
}

HexagonIndex::~HexagonIndex()
{
}

std::vector<Index::Ptr> HexagonIndex::neighbours(bool gravity)
{
	if (gravity)
		return { left(), right(), bottomLeft(), bottomRight() };
	else
		return { topLeft(), topRight(), left(), right(), bottomLeft(), bottomRight() };
}