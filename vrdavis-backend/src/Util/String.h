#ifndef UTIL_STRING_H_
#define UTIL_STRING_H_

#include <string>
#include <vector>

// Escape URL strings
std::string SafeStringEscape(const std::string& input);

// split input string into a vector of strings by delimiter
void SplitString(std::string& input, char delim, std::vector<std::string>& parts);

// determines whether a string ends with another given string
bool HasSuffix(const std::string& haystack, const std::string& needle, bool case_sensitive = false);

// determine whether strings are equal in constant time, rather than based on early-exit
bool ConstantTimeStringCompare(const std::string& a, const std::string& b);

#endif // UTIL_STRING_H_