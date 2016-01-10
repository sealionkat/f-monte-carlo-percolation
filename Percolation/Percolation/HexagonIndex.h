#pragma once

#include "Index.h"

class HexagonIndex :
	public Index
{
public:
	HexagonIndex(const int &y, const int &x);
	~HexagonIndex();

	virtual std::vector<Index::Ptr> neighbours(bool gravity = false);

private:
	Index::Ptr topLeft() const { return std::make_shared<HexagonIndex>(y - 1, (y & 1) ? x : x - 1); }
	Index::Ptr topRight() const { return std::make_shared<HexagonIndex>(y - 1, (y & 1) ? x + 1 : x); }
	Index::Ptr bottomLeft() const { return std::make_shared<HexagonIndex>(y + 1, (y & 1) ? x : x - 1); }
	Index::Ptr bottomRight() const { return std::make_shared<HexagonIndex>(y + 1, (y & 1) ? x + 1 : x); }
	Index::Ptr left() const { return std::make_shared<HexagonIndex>(y, x - 1); }
	Index::Ptr right() const { return std::make_shared<HexagonIndex>(y, x + 1); }
};

