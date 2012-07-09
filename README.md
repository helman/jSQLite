This is my Javascript Class for HTML5 Databases connection to SQLite. I use this to build mobile application, including iOS, Android, and BlackBerry. I wrote this class to do the instance query to SQLite, and also some function for delete, insert, and update database records and table creation and deletion.

How To Use It
-------------
Create or open database with 'websiteDB' as database name and 'website DB' as title, and database site is 5MB I'm not using 1024 for the size multiplying because i don't want to be near at the margin size

    var db = new cDB({_db:window.openDatabase(&quot;websiteDB&quot;, &quot;&quot;, &quot;website DB&quot;, 5*1000*1000)});


### Table Creation:
dbTable is database structure in this example, and contains 2 tables 'foo' and 'boo' and also the table structure in table properties

    var dbTable = [
      {table:'foo',properties: [
        {name:'foo_id', type: 'INT PRIMARY KEY ASC'},
        {name:'foo_field_1', type: ''},
        {name:'foo)field_2', type: ''}
      ]},
      {table:'boo',properties: [
        {name:'boo_id', type: 'INT PRIMARY KEY ASC'},
        {name:'boo_field_1', type: ''},
        {name:'boo_field_2', type: ''}
      ]}
    ];

this line is checking if the database exist or not and then create the database structure. Table will be created if the table is not exist yet, if the table already exist, it will skip the table and continue with others tables

    if(!db.check(dbTable)){
      db = false;
      alert('Failed to cennect to database.');
    }

### Drop Table:
    db.dropTable('foo');

### Add / Insert Record:
    var row = [];
    row.push([
      {'name':'foo_id','value':1},
      {'name':'foo_field_1','value':'value 1 field_1'},
      {'name':'foo_field_2','value':'value 1 field_2']}
    ]);

Insert without callback

    db.insert('foo',row);

Insert and return callback

    db.insert('foo',row,function(tx,res){
      console.log('Insert ID: '+res.insertId);
    });

SQLite is not accepting more than 1 line statement, that is the reason why we not able to do more than one statement query, like insertion.  If you want to insert more than 1 record at the time, you need to use this function.

### Multiline records Insertion:
    var rows = [];
    rows.push([
      {'name':'boo_id','value':1},
      {'name':'boo_field_1','value':'value 1 field_1'},
      {'name':'boo_field_2','value':'value 1 field_2']}
    ]);
    rows.push([
      {'name':'boo_id','value':2},
      {'name':'boo_field_1','value':'value 2 field_1'},
      {'name':'boo_field_2','value':'value 2 field_2']}
    ]);

    db.multiInsert('boo',rows,function(){alert('insertion done');});

Or, if you want to combine that two functions, just put if condition:
    if(rows.length>=2){
      db.multiInsert('boo',rows,function(){alert('insertion done');});
    }else{
      db.insert('boo',rows);
    }

### Delete record:
    db.remove('boo',[{'name':'boo_id','value':1}])

### Update record:
    db.update('boo',[[
      {'name':'boo_id','value':2},
      {'name':'boo_field_1','value':'boo value'}
    ]],['name':'boo_id','value':2])

### Query:
    var query = 'SELECT * FROM foo';
    db.query(query,function(tx,res){
      if(res.rows.length){
        alert('found '+res.rows.length+' record(s)');
      }else{
        alert('table foo is empty');
      }
    });

Cheers,
helman