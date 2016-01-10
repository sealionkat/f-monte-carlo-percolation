#include "Index.h"

Index::Index(const int &y, const int &x) :
	x(x),
	y(y)
{
}

Index::~Index()
{
}

bool operator<(const Index &i1, const Index &i2)
{
	return i1.y < i2.y || (!(i2.y < i1.y) && i1.x < i2.x);
}