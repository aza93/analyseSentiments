import tweepy
import re
import io
import csv

# Credentials
consumer_key = "Ku6mMDrwUMgTGtZro1r9cLb6W"
consumer_secret = "agXrBFszag40NMc6bMTFF9Y3agqWL5l5HBT2rG9itIhQzAmWJe"
access_token = "969906020330897409-lO2PhATDWh9Uxo9enuJuaPpSJtaO2RD"
access_token_secret = "LZh4hbYdl4lsHypWVibQwoG3Ov6FnJujG9qnMezvFdjjJ"

# create OAuthHandler object
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
# set access token and secret
auth.set_access_token(access_token, access_token_secret)
# create tweepy API object to fetch tweets
api = tweepy.API(auth,wait_on_rate_limit=True)

csvFile = open('data.csv', 'w')
csvWriter = csv.writer(csvFile)

print('Enter your keyword:')
search_words = input()      # enter your words
new_search = search_words + " -filter:retweets"

count = 0

for tweet in tweepy.Cursor(api.search,q=new_search,count=99,lang="en", since_id=0).items():
    count = count + 1
    print('tweet number', count)
    if count <= 99:
        csvWriter.writerow([tweet.created_at, tweet.text,tweet.user.screen_name, tweet.user.location])
    else:
        break;