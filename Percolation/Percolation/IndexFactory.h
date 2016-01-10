#pragma once

#include "TriangleIndex.h"
#include "SquareIndex.h"
#include "HexagonIndex.h"
#include "GridType.h"

class IndexFactory
{
public:
	IndexFactory() = delete;

	static Index::Ptr create(GridType type, int y, int x)
	{
		switch (type)
		{
		case GridType::Triangles:
			return std::make_shared<TriangleIndex>(y, x);

		case GridType::Squares:
			return std::make_shared<SquareIndex>(y, x);

		case GridType::Hexagons:
			return std::make_shared<HexagonIndex>(y, x);

		default:
			return std::shared_ptr<Index>();
		}
	}
};