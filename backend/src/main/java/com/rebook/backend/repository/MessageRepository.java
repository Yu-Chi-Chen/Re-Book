package com.rebook.backend.repository;

import com.rebook.backend.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {

    // 查詢買家與賣家之間的所有對話（包含買家發給賣家，以及賣家回覆給買家），並依時間排序
    @Query("{ $or: [ { 'senderID': ?0, 'receiverID': ?1 }, { 'senderID': ?1, 'receiverID': ?0 } ] }")
    List<Message> findChatHistory(String user1, String user2, org.springframework.data.domain.Sort sort);

    // 查詢我是發送者或接收者的所有訊息，並依時間遞減排序 (最新的在最上面)
    @Query("{ $or: [ { 'senderID': ?0 }, { 'receiverID': ?0 } ] }")
    List<Message> findAllUserMessages(String userID, org.springframework.data.domain.Sort sort);
}