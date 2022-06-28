#ifndef MIMETYPES_H_
#define MIMETYPES_H_

#include <string>
#include <unordered_map>

namespace vrdavis {
const static std::unordered_map<std::string, std::string> MimeTypes = {{".css", "text/css"}, {".htm", "text/html"}, {".html", "text/html"},
    {".jpg", "image/jpeg"}, {".jpeg", "image/jpeg"}, {".js", "text/javascript"}, {".json", "application/json"}, {".png", "image/png"},
    {".svg", "image/svg+xml"}, {".woff", "font/woff"}, {".woff2", "font/woff2"}, {".wasm", "application/wasm"}};
} // namespace vrdavis

#endif // MIMETYPES_H_