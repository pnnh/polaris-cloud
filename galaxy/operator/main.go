package main

import (
	"github.com/pnnh/quantum/golang/neutron/config"
	"github.com/pnnh/quantum/golang/neutron/services/datastore"
	"github.com/sirupsen/logrus"
)

func main() {
	accountDSN, ok := config.GetConfiguration("DATABASE")
	if !ok || accountDSN == nil {
		logrus.Errorln("DATABASE未配置")
	}

	if err := datastore.Init(accountDSN.(string)); err != nil {
		logrus.Fatalln("datastore: ", err)
	}

	webServer, err := NewWebServer()
	if err != nil {
		logrus.Fatalln("创建web server出错", err)
	}

	if err := webServer.Start(); err != nil {
		logrus.Fatalln("应用程序执行出错: %w", err)
	}
}