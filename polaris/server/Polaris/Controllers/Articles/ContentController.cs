﻿using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Polaris.Utils;
using System.Text;
using Molecule.Models;
using Polaris.Business.Models;
using Polaris.Business.Helpers;
using Molecule.Helpers;

namespace Polaris.Controllers.Article;

[ApiController]
public class ArticleContentController : ControllerBase
{
    private readonly ILogger<ArticleContentController> _logger;
    private readonly DatabaseContext _dataContext;

    public ArticleContentController(ILogger<ArticleContentController> logger, DatabaseContext configuration)
    {
        this._logger = logger;
        this._dataContext = configuration;
    }

    [Route("/server/article/{pk}")]
    [HttpGet]
    [AllowAnonymous]
    public ArticleModel Get([FromRoute] string pk)
    {
        var sqlBuilder = new StringBuilder();
        var parameters = new Dictionary<string, object>();

        sqlBuilder.Append(@"
select a.*
from articles as a
where a.pk = @article
");
        parameters.Add("@article", pk);

        var querySqlText = sqlBuilder.ToString();

        var modelsQuery = DatabaseContextHelper.RawSqlQuery<ArticleModel>(_dataContext, querySqlText, parameters);

        var model = modelsQuery.FirstOrDefault();

        if (model == null)
        {
            throw new PLBizException("文章不存在");
        }

        return model;
    }


    [Route("/server/article")]
    [AllowAnonymous]
    public PLSelectResult<ArticleModel> Select()
    {
        var queryHelper = new PLQueryHelper(Request.Query);
        var channel = queryHelper.GetString("channel");
        var keyword = queryHelper.GetString("keyword");
        var sort = queryHelper.GetString("sort") ?? "latest";
        var filter = queryHelper.GetString("filter") ?? "all";

        var page = queryHelper.GetInt("page") ?? 1;
        var size = queryHelper.GetInt("size") ?? 10;
        var (offset, limit) = Pagination.CalcOffset(page, size);

        var sqlBuilder = new StringBuilder();
        var parameters = new Dictionary<string, object>();

        sqlBuilder.Append(@"
select a.*, r.pk as relation, r.discover, r.source as channel
from relations as r
    left join articles as a on r.target = a.pk
where r.direction = 'cta' and a.pk is not null
");
        if (!string.IsNullOrEmpty(channel))
        {
            sqlBuilder.Append(@" and r.source = @channel");
            parameters.Add("@channel", channel);
        }

        if (keyword != null && !string.IsNullOrEmpty(keyword))
        {
            sqlBuilder.Append(@" and (a.title like @keyword or a.description like @keyword)");
            parameters.Add("@keyword", $@"%{keyword}%");
        }

        if (filter == "month")
        {
            sqlBuilder.Append(@" and r.update_time > @update_time");
            parameters.Add("@update_time", DateTime.UtcNow.AddMonths(-1));
        }
        else if (filter == "year")
        {
            sqlBuilder.Append(@" and r.update_time > @update_time");
            parameters.Add("@update_time", DateTime.UtcNow.AddYears(-1));
        }

        var countSqlText = $@"
select count(1) from ({sqlBuilder}) as temp;";

        var totalCount = DatabaseContextHelper.RawSqlScalar<int?>(_dataContext, countSqlText, parameters);

        if (sort == "read")
        {
            sqlBuilder.Append(@" order by r.discover desc");
        }
        else
        {
            sqlBuilder.Append(@" order by a.update_time desc");
        }

        sqlBuilder.Append(@" limit @limit offset @offset;");
        parameters.Add("@offset", offset);
        parameters.Add("@limit", limit);

        var querySqlText = sqlBuilder.ToString();

        var modelsQuery = DatabaseContextHelper.RawSqlQuery<ArticleModel>(_dataContext, querySqlText, parameters);

        var models = modelsQuery.ToList();

        return new PLSelectResult<ArticleModel>
        {
            Range = models,
            Count = totalCount ?? 0,
        };
    }

    [Route("/server/article/{pk}")]
    [HttpDelete]
    public PLDeleteResult Delete([FromRoute] string pk)
    {
        var model = _dataContext.Articles.FirstOrDefault(m => m.Pk == pk);
        if (model == null)
        {
            throw new PLBizException("文章不存在");
        }
        _dataContext.Articles.Remove(model);
        var changes = _dataContext.SaveChanges();

        return new PLDeleteResult
        {
            Changes = changes
        };
    }

    [Route("/server/article")]
    [HttpPost]
    public async Task<PLInsertResult> Insert()
    {
        var jsonHelper = await JsonHelper.NewAsync(Request.Body);
        var title = jsonHelper.GetString("title") ?? throw new PLBizException("title is required");
        var body = jsonHelper.GetString("body") ?? throw new PLBizException("body is required");

        var user = HttpContext.User;
        if (user.Identity == null || string.IsNullOrEmpty(user.Identity.Name))
        {
            throw new PLBizException("用户未登录");
        }
        var model = new ArticleModel()
        {
            Pk = Guid.NewGuid().ToString(),
            Title = title,
            Body = body,
            Header = "markdown",
            CreateTime = DateTime.UtcNow,
            UpdateTime = DateTime.UtcNow,
            Creator = user.Identity.Name,
        };
        _dataContext.Articles.Add(model);
        _dataContext.SaveChanges();

        return new PLInsertResult { Pk = model.Pk };
    }

    [Route("/server/article/{pk}")]
    [HttpPut]
    public async Task<PLUpdateResult> Update([FromRoute]string pk)
    {
        var jsonHelper = await JsonHelper.NewAsync(Request.Body);
        var title = jsonHelper.GetString("title") ?? throw new PLBizException("title is required");
        var body = jsonHelper.GetString("body") ?? throw new PLBizException("body is required");

        var model = _dataContext.Articles.FirstOrDefault(m => m.Pk == pk);
        if (model == null)
        { 
            throw new PLBizException("文章不存在");
        }

        model.Title = title;
        model.Body = body;
        var changes = _dataContext.SaveChanges();

        return new PLUpdateResult { Changes = changes };
    }

    [Route("/server/article/share")]
    [HttpPost]
    public async Task<PLUpdateResult> Share()
    {
        var formHelper = await JsonHelper.NewAsync(Request.Body);
        var pk = formHelper.GetString("pk") ?? throw new Exception("pk is required");
        var address = formHelper.GetString("address") ?? throw new Exception("address is required");

        var model = _dataContext.Channels.FirstOrDefault(m => m.Name == address);
        if (model == null)
        {
            throw new PLBizException("频道不存在");
        }
        var user = HttpContext.User;
        var creatorPk = "";
        if (user.Identity != null && !string.IsNullOrEmpty(user.Identity.Name))
        {
            var account = _dataContext.Accounts.FirstOrDefault(o => o.Username == user.Identity.Name);
            if (account != null) creatorPk = account.Pk;
        }
        var relation = new RelationModel()
        {
            Pk = Guid.NewGuid().ToString(),
            Source = model.Pk,
            Target = pk,
            Direction = "cta",
            CreateTime = DateTime.UtcNow,
            UpdateTime = DateTime.UtcNow,
            Creator = creatorPk,
            Discover = 0,
        };
        _dataContext.Relations.Add(relation);
        var changes = _dataContext.SaveChanges();

        return new PLUpdateResult { Changes = changes };
    }
}