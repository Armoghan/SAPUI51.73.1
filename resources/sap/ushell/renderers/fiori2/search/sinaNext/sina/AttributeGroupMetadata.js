// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sinaDefine(['../core/core','./SinaObject','./AttributeType','./AttributeMetadataBase'],function(c,S,A,a){"use strict";return a.derive({_meta:{properties:{type:{required:false,default:A.Group},label:{required:false},isSortable:{required:false,default:false},template:{required:false},attributes:{required:true,default:function(){return[];}}}}});});