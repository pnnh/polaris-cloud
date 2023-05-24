//
// Created by Larry on 2023/2/11.
//

#ifndef MULTIVERSE_APPEXCEPTION_H
#define MULTIVERSE_APPEXCEPTION_H

#include <exception>
#include <string>

namespace business {
class AppException : public std::exception {
  const char *what() const throw() {
    return reinterpret_cast<const char *>(message.data());
  }

public:
  AppException(QString message) : message(message) {}

private:
  QString message;
};
} // namespace business

#endif // MULTIVERSE_APPEXCEPTION_H
