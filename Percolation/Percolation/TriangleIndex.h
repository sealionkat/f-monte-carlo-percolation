#pragma once

#include "Index.h"

class TriangleIndex :
	public Index
{
public:
	TriangleIndex(const int &y, const int &x);
	virtual ~TriangleIndex();

	virtual std::vector<Index::Ptr> neighbours(bool gravity = false);
};

