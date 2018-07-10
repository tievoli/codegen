package com.tievoli.codegen.service;

import com.baomidou.mybatisplus.generator.InjectionConfig;
import com.baomidou.mybatisplus.generator.config.po.TableInfo;
import lombok.Data;
import org.springframework.util.StringUtils;

import java.util.List;


@Data
public class EntityNameRewriter extends InjectionConfig {

    private String entityName;

    @Override
    public void initMap() {
        if (StringUtils.hasText(entityName)) {
            List<TableInfo> tableInfoList = this.getConfig().getTableInfoList();
            if (tableInfoList != null) {
                tableInfoList.get(0).setComment(entityName);
            }
        }
    }
}
