use chineseDuck

db.createCollection("users")

db.createCollection("wordFiles", {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: [
                'word_id',
                'createDate',
                'bytes',
                'fileType'
            ],
            properties: {
                word_id: {
                    bsonType: 'long'
                },
                createDate: {
                    bsonType: 'date'
                },
                bytes: {
                    bsonType: 'binData'
                },
                height: {
                    bsonType: 'int'
                },
                width: {
                    bsonType: 'int'
                },
                fileType: {
                    'enum': [
                        'audio',
                        'orig',
                        'pron',
                        'trans',
                        'full'
                    ]
                }
            }
        },
    }
}
)

db.createCollection("folders", {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: [
                '_id',
                'name',
                'owner_id',
                'activityDate'
            ],
            properties: {
                _id: {
                    bsonType: 'long'
                },
                name: {
                    bsonType: 'string'
                },
                owner_id: {
                    bsonType: 'long'
                },
                activityDate: {
                    bsonType: 'date'
                },
                wordsCount: {
                    bsonType: 'int'
                }
            }
        },
    }
}
)

db.folders.createIndex(
    { owner_id: 1, name: "" }, { unique: true }
)

db.folders.createIndex({ name: "text" })

db.createCollection("words", {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: [
                '_id',
                'originalWord',
                'translation',
                'syllablesCount',
                'folder_id',
                'owner_id',
                'createDate'
            ],
            properties: {
                _id: {
                    bsonType: 'long'
                },
                owner_id: {
                    bsonType: 'long'
                },
                originalWord: {
                    bsonType: 'string'
                },
                pronunciation: {
                    bsonType: 'string'
                },
                translation: {
                    bsonType: 'string'
                },
                usage: {
                    bsonType: 'string'
                },
                syllablesCount: {
                    bsonType: 'int'
                },
                folder_id: {
                    bsonType: 'long'
                },
                createDate: {
                    bsonType: 'date'
                },
                score: {
                    bsonType: 'object',
                    required: [
                        'lastView',
                        'isInLearnMode'
                    ],
                    properties: {
                        originalWordCount: {
                            bsonType: 'int'
                        },
                        originalWordSuccessCount: {
                            bsonType: 'int'
                        },
                        lastView: {
                            bsonType: 'date'
                        },
                        lastLearned: {
                            bsonType: 'string'
                        },
                        lastLearnMode: {                            
                            'enum': [
                                'OriginalWord',
                                'Translation',
                                'FullView',
                                'Pronunciation'
                            ]
                        },
                        isInLearnMode: {
                            bsonType: 'bool'
                        },
                        rightAnswerNumber: {
                            bsonType: 'int'
                        },
                        pronunciationCount: {
                            bsonType: 'int'
                        },
                        pronunciationSuccessCount: {
                            bsonType: 'int'
                        },
                        translationCount: {
                            bsonType: 'int'
                        },
                        translationSuccessCount: {
                            bsonType: 'int'
                        },
                        viewCount: {
                            bsonType: 'int'
                        },
                        name: {
                            type: 'string'
                        }
                    }
                }
            }
        },
    }
}
)

db.words.createIndex(
    { originalWord: "text", owner_id: 1 },
    { language_override: "hans" })


db.counters.insert(
    {
        _id: "userid",
        seq: 0
    }
)