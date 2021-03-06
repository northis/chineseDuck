SELECT [IdWord] as word_id
      ,[CreateDate] as createDate
      ,cast(N'' as xml).value('xs:base64Binary(sql:column("[Bytes]"))', 'varchar(max)') as bytes
      ,[Height] as height
      ,[Width] as width
	  , 'full' as fileType
  FROM [LearnChinese].[dbo].[WordFileA] FOR JSON PATH

  SELECT [IdWord] as word_id
      ,[CreateDate] as createDate
      ,cast(N'' as xml).value('xs:base64Binary(sql:column("[Bytes]"))', 'varchar(max)') as bytes
      ,[Height] as height
      ,[Width] as width
	  , 'orig' as fileType
  FROM [LearnChinese].[dbo].[WordFileO] FOR JSON PATH

    SELECT [IdWord] as word_id
      ,[CreateDate] as createDate
      ,cast(N'' as xml).value('xs:base64Binary(sql:column("[Bytes]"))', 'varchar(max)') as bytes
      ,[Height] as height
      ,[Width] as width
	  , 'pron' as fileType
  FROM [LearnChinese].[dbo].[WordFileP] FOR JSON PATH
  
  SELECT [IdWord] as word_id
      ,[CreateDate] as createDate
      ,cast(N'' as xml).value('xs:base64Binary(sql:column("[Bytes]"))', 'varchar(max)') as bytes
      ,[Height] as height
      ,[Width] as width
	  , 'trans' as fileType
  FROM [LearnChinese].[dbo].[WordFileT] FOR JSON PATH
