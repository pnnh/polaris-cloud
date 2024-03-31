
#include "pulsar/server/main/services/config/appconfig.h"
#include <cstdio>
#include <cstdlib>
#include <string>

#include "pulsar/server/common/utils/md5.h"
#include <cstdio>
#include <cstdlib>

int main_common()
{
  std::string content = "hello world";
  std::string md5 = calcMd5(content);
  printf("md5 of %s is %s\n", content.c_str(), md5.c_str());

  std::string md5sum = "5EB63BBBE01EEED093CB22BB8F5ACDC3";
  if (md5 == md5sum)
  {
    return 0;
  }
  return -1;
}

int main() {
  std::string dsn = AppConfig::Default().GetDSN();
  printf("dsn is %s\n", dsn.c_str());

  std::string realValue{"xyz"};
  if (dsn == realValue) {
    return 0;
  }
  return -1;
}
