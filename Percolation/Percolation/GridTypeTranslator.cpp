#include "GridTypeTranslator.h"

#include <boost\algorithm\string.hpp>

const std::map<std::string, GridType> GridTypeTranslator::string_to_type =
{
	{ "triangles", GridType::Triangles },
	{ "squares", GridType::Squares },
	{ "hexagons", GridType::Hexagons }
};

GridType GridTypeTranslator::fromString(std::string type)
{
	boost::algorithm::to_lower(type);

	if (!string_to_type.count(type))
		throw std::invalid_argument("Inavalid grid type");

	return string_to_type.at(type);
}