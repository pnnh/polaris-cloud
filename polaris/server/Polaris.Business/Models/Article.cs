

using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;
using System.Text.Json.Serialization;
using AutoMapper;
using System.Data;

namespace Polaris.Business.Models
{

    [Table("articles")]
    [PrimaryKey(nameof(Pk))]
    public class ArticleModel
    {
        [Column("pk", TypeName = "varchar(64)")]
        public string Pk { get; set; } = "";

        [Column("title", TypeName = "varchar(128)")]
        public string Title { get; set; } = "";

        [Column("header", TypeName = "varchar(64)")]
        public string Header { get; set; } = "";

        [Column("body", TypeName = "text")]
        public string Body { get; set; } = "";

        [Column("create_time", TypeName = "timestamptz")]
        [JsonPropertyName("create_time")]
        public DateTimeOffset CreateTime { get; set; } = new(2023, 1, 1, 0, 0, 0, TimeSpan.Zero);

        [Column("update_time", TypeName = "timestamptz")]
        [JsonPropertyName("update_time")]
        public DateTimeOffset UpdateTime { get; set; } = new(2023, 1, 1, 0, 0, 0, TimeSpan.Zero);

        [Column("creator", TypeName = "varchar(64)")]
        public string Creator { get; set; } = "";

        [Column("keywords", TypeName = "varchar(128)")]
        public string Keywords { get; set; } = "";

        [Column("description", TypeName = "varchar(512)")]
        public string Description { get; set; } = "";

        [Column("status", TypeName = "int")]
        public int Status { get; set; } = 0;

        [Column("cover", TypeName = "varchar(256)")]
        public string Cover { get; set; } = "";

        [NotMapped]
        [JsonPropertyName("relation")]
        public string Relation { get; set; } = "";

        [NotMapped]
        [JsonPropertyName("discover")]
        public long Discover { get; set; } = 0;

        [NotMapped]
        [JsonPropertyName("channel")]
        public string Channel { get; set; } = "";

        public static void MapperConfig(IMapperConfigurationExpression cfg)
        {
            cfg.CreateMap<IDataReader, ArticleModel>()
                .ForMember(a => a.CreateTime, opt => opt.MapFrom(src => src["create_time"]))
                .ForMember(a => a.UpdateTime, opt => opt.MapFrom(src => src["update_time"]));
        }
    }
}