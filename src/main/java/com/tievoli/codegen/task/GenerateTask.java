package com.tievoli.codegen.task;

import lombok.Data;

@Data
public class GenerateTask {

    //项目路径
    private String projectLocation;

    //表前缀
    private String tablePrefix;

    //包名称
    private String packageName;

    //表名称
    private String tableName;

    //实体名称
    private String entityName;

    //模块名称
    private String module;

    //开发者
    private String developer;

    //仅生成实体
    private Boolean onlyGenerateEntity;
}
