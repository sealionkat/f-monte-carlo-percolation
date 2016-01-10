#pragma once

#include <string>
#include <map>

#include "GridType.h"

class GridTypeTranslator
{
public:
	GridTypeTranslator() = delete;
	static GridType fromString(std::string type);

private:
	static const std::map<std::string, GridType> string_to_type;
};

