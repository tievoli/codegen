package com.tievoli.codegen.controller;

import com.tievoli.codegen.config.CodeGenConfig;
import com.tievoli.codegen.protocol.Result;
import com.tievoli.codegen.service.GenerateService;
import com.tievoli.codegen.service.TableService;
import com.tievoli.codegen.task.GenerateTask;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;


@RestController
@Api(value = "/generator", tags = "代码生成器接口")
@RequestMapping("/generator")
public class GeneratorController {

    @Autowired
    private TableService tableService;

    @Autowired
    private GenerateService generateService;

    @Autowired
    private CodeGenConfig codeGenConfig;

    /**
     * 获取环境信息
     */
    @GetMapping("/env")
    @ApiOperation("获取代码生成器配置")
    public Object blackboard() {
        HashMap<String, Object> hashMap = new HashMap<>();
        hashMap.put("tables", tableService.getAllTables());
        hashMap.put("params", codeGenConfig);
        Result result = Result.buildSuccess(hashMap);
        return result;
    }

    /**
     * 生成代码
     */
    @ApiOperation("生成代码")
    @PostMapping("/generate")
    public Object generate(GenerateTask generateTask) {
        generateService.generate(generateTask);
        return Result.buildSuccess("");
    }
}
