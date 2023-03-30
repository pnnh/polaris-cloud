package users

import (
	"github.com/gin-gonic/gin"
	"github.com/pnnh/multiverse-cloud-server/models"
	"github.com/sirupsen/logrus"
	"net/http"
)

func UserSelectHandler(gctx *gin.Context) {
	offset := gctx.PostForm("offset")
	limit := gctx.PostForm("limit")
	logrus.Debugln("offset", offset, "limit", limit)

	accounts, err := models.SelectAccounts(0, 10)
	if err != nil {
		gctx.JSON(http.StatusOK, models.CodeError.WithError(err))
		return
	}
	count, err := models.CountAccounts()
	if err != nil {
		gctx.JSON(http.StatusOK, models.CodeError.WithError(err))
		return
	}
	sessionData := map[string]interface{}{
		"list":  accounts,
		"count": count,
	}

	result := models.CodeOk.WithData(sessionData)

	gctx.JSON(http.StatusOK, result)
}
