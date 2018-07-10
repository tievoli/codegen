app.controller('GeneratorCtrl', [
    '$scope',
    '$compile',
    '$http',
    'Messager',
    '$modal',
    function ($scope, $compile, $http, Messager, $modal) {
        function load() {
            $scope.loading = true;
            $scope.setting = {
                projectLocation: '',
                developer: '',
                tablePrefix: '',
                model: ''
            };
            $http.get("generator/env").success(
                function (result, status, headers, config) {
                    $scope.loading = false;
                    if (result.success) {
                        $scope.tables = result.data.tables;
                        var params = result.data.params;
                        $scope.setting.projectLocation = params.projectLocation;
                        $scope.setting.developer = params.developer;
                        $scope.setting.tablePrefix = params.tablePrefix;
                    } else {
                        $scope.error = result.message;
                    }
                }).error(function (result, status) {
                $scope.loading = false;
                $scope.error = result.message || status;
            });
        }

        $scope.setup = 0;
        $scope.forward = function(setup){
            $scope.setup = setup;
        }

        load();

        $scope.onTableClick = function (table) {
            $scope.current = table;
            if(table.tableComment){
                $scope.setting.entityName = table.tableComment;
            }
        }

        $scope.parseEnityName = function (table) {
            if (!table) {
                return;
            }
            table = table.toLowerCase();
            if ($scope.setting.tablePrefix) {
                table = table.replace($scope.setting.tablePrefix, "");
            }
            var names = table.split("_");
            var entityName = [];
            for (var i = 0; i < names.length; i++) {
                var name = names[i];
                if (name.length > 0) {
                    var upperName = name.substring(0, 1).toUpperCase() + name.substring(1, name.length);
                    entityName.push(upperName);
                }
            }
            return entityName.join("");
        }

        //添加多个实体,这里是操作dom对象
        //TODO 未完成
        $scope.addEntity = function(){
            var html="<div>" +
                "<div class='line line-dashed b-b line-lg'></div>\n" +
                "                        <div class='form-group'>\n" +
                "                            <label class='col-sm-2 control-label'>实体名称</label>\n" +
                "                            <div class='col-sm-10'>\n" +
                "                                <input type='text' name='receiver' required ng-model='setting.entityName'\n" +
                "                                       class='form-control'>\n" +
                "                                <div class=\"help-block\">实体名称，例如：生产订单。注意实体名称后不要带XX表</div>\n" +
                "                            </div>\n" +
                "                        </div>\n" +
                "                        <div class='line line-dashed b-b line-lg'></div>\n" +
                "                        <div class='form-group'>\n" +
                "                            <label class='col-sm-2 control-label'>数据表</label>\n" +
                "                            <div class='col-sm-10'>\n" +
                "                                <input type='text' readonly ng-model='current.tableName'\n" +
                "                                       class='form-control'>\n" +
                "                            </div>\n" +
                "                        </div>" +
                "</div>";
            var template = angular.element(html);
            var entityElement = $compile(template)($scope);
            angular.element("#addEntity").after(entityElement);

        };


        $scope.generate = function () {

            Messager.confirm("提示","确定要生成代码?").then(function(){
                var setting = $scope.setting;
                var params = {
                    projectLocation: setting.projectLocation,
                    developer: setting.developer,
                    module: setting.module,
                    entityName: setting.entityName,
                    tableName: $scope.current.tableName,
                    tablePrefix: setting.tablePrefix,
                    packageName: setting.packageName,
                    onlyGenerateEntity: setting.onlyGenerateEntity
                };
                $scope.generating = true;
                var toast = $scope.toaster.wait("正在生成...");
                $http.post('generator/generate', params).success(
                    function (data, status, headers, config) {
                        $scope.generating = false;
                        if (data.success) {
                            /* $scope.settingForm.$setPristine();
                             $scope.settingForm.$setUntouched();*/
                            toast.doSuccess("生成成功");
                            $scope.forward(0);
                        } else {
                            toast.doError("生成失败：" + (result.msg || status));
                        }
                    }).error(function (result, status) {
                    $scope.generating = false;
                    toast.doError("生成失败：" + (result.msg || status));
                });
            });


        }
    }]);
