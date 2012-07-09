// JavaScript Document
function cDB(confs){
	var ret = {
		_db: null,
		_response: null,
		_error: null,
		check : function(tbl,callback){
			if(!this._db) return false;
			
			var _sql = '', _sqlField='', _field=[];
			
			for(var i=0;i<tbl.length;i++){
				_sql = "CREATE TABLE IF NOT EXISTS "+tbl[i].table+" (";
				_field = tbl[i].properties;
				_sqlField = '';
				
				for (var j=0;j<_field.length;j++){
					_sqlField += ',`'+_field[j].name+'` '+_field[j].type;
				}
	
				_sql += _sqlField.substr(1)+");";
				
				this.query(_sql,callback,null,null);
			}
	
			return true;
		},
		__: function(s){
			return s;
		},
		getResult:function(){
			return this._response;
		},
		getError:function(){
			return this._error;
		},
		callback_error: function(tx,_er){
			var err = '';
			if(typeof(tx) == 'object'){
				for(var q in tx){
					err += q+' = "'+tx[q]+'"; ';
				}
			}else{
				err += tx+'; ';
			}
			if(typeof(_er) == 'object'){
				for(var q in _er){
					err += q+' = "'+_er[q]+'"; ';
				}
			}else if(typeof(_er) == 'undefined'){
				err += _er+'; ';
			}
			//if(callback) callback();
			return false;
		},
		query: function(sql,callback,params,er){
			if(!this._db) return false;
			var self = this;
			function _genErrorCallback(sql){
				return function(tx,__er){
					__er = jQuery.extend(__er,{sql:sql});
					if(er) er(tx,__er);
					else self.callback_error(tx,__er);
				}
			};
			var _query = [];
				if(params)
					_query = params;
				_query.splice(0,0,sql);
			
			this._db.transaction(function(tx){
				tx.executeSql(_query,function(res){
					callback(this,res);
				},self.callback_error);
			},function(){return false;}, _genErrorCallback(_query));
		},
		update:function(tbl,sets,clauses,callback){
			var __sql = 'UPDATE '+tbl, _field = null, __set = '', __clause = '',__values=[];
			
			for(var i=0;i<sets.length;i++){
				_field = sets[i];
				for(var j=0;j<_field.length;j++){
					__set += ',`'+_field[j].name+'`=?';
					__values.push(_field[j].value);
				}
			}
	
			for(var i=0;i<clauses.length;i++){
				__clause += ',`'+clauses[i].name+'`=?';
				__values.push(clauses[i].value);
			}
			__sql += ((__set!='')?' SET '+__set.substr(1):'')+((__clause!='')?' WHERE '+__clause.substr(1):'')+';';
			this.query(__sql,callback,__values);
			return true;
		},
		remove:function(tbl, clauses, callback){
			var __sql = 'DELETE FROM '+tbl, __clause = '';
			
			if(typeof(clauses) != 'undefined'){
				for(var i=0;i<clauses.length;i++)
					__clause += ',`'+clauses[i].name+'`="'+escape(clauses[i].value)+'"';

				if(clauses.length > 0)
					__sql += ' WHERE ' + ((__clause!='')?__clause.substr(1):'FALSE');
			}
			__sql += ';';
			this.query(__sql,callback);
			return true;
		},
		multiInsert: function(tbl,rows,callback,er){
			if(!this._db) return false;
			var self = this;
			var __sql = '', _field = null, __field = '', __qs = [], __values = [];
			
			this._db.transaction(function(tx){
				for(var i=0;i<rows.length;i++){
					__qs = [];
					__values = [];
					__field = '';
					_field = rows[i];
					
					for(var j=0;j<_field.length;j++){
						__field += ',`'+_field[j].name+'`';
						__qs.push('?');
						__values.push(_field[j].value ? _field[j].value : '');
					}
	
					var _sql = 'INSERT INTO '+tbl+' ('+__field.substr(1)+') VALUES('+__qs.join(',')+');';
					var _query = [];
					if(__values)
						_query = __values;
					_query.splice(0,0,_sql);
					tx.executeSql(_query,function(){return false;},self.callback_error);
				}
			}, function(){
				if(callback) callback();
				return true;
			}, self.callback_error);
	
			return true;
		},
		insert:function(tbl,rows,callback){
			var __sql = '', _field = null, __field = '', __qs = [], __values = [], __debug = '';
			
			for(var i=0;i<rows.length;i++){
				__qs = [];
				__field = '';
				_field = rows[i];
				
				__debug += _field[0].name+' = '+_field[0].value+';';
				for(var j=0;j<_field.length;j++){
					__field += ',`'+_field[j].name+'`';
					__qs.push('?');
					__values.push(_field[j].value ? _field[j].value : '');
				}
				__sql += 'INSERT INTO '+tbl+' ('+__field.substr(1)+') VALUES('+__qs.join(',')+');';
			}
			this.query(__sql,callback,__values);
			return true;
		},
		insertReplace:function(tbl,rows,debug){
			var __sql = '', _field = null, __field = '', __qs = [], __values = [], __debug = '';
			
			for(var i=0;i<rows.length;i++){
				__qs = [];
				__field = '';
				_field = rows[i];
				
				__debug += _field[0].name+' = '+_field[0].value+';';
				for(var j=0;j<_field.length;j++){
					__field += ',`'+_field[j].name+'`';
					__qs.push('?');
					__values.push(_field[j].value ? _field[j].value : '');
				}
				__sql += 'INSERT OR REPLACE INTO '+tbl+' ('+__field.substr(1)+') VALUES('+__qs.join(',')+');';
			}
			this.query(__sql,null,__values);
			return true;
		},
		dropTable:function(tbl,callback){
			var __sql = '';
			if(tbl==null) return false;
			__sql = 'DROP TABLE IF EXISTS '+tbl;
			this.query(__sql,callback);
			return true;
		}
	}
	return jQuery.extend(ret,confs);
}
