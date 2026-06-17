package com.rebook.backend.repository;

import com.rebook.backend.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {

    @Query("{ $or: [ { 'senderID': ?0, 'receiverID': ?1 }, { 'senderID': ?1, 'receiverID': ?0 } ] }")
    List<Message> findChatHistory(String user1, String user2, org.springframework.data.domain.Sort sort);

    @Query("{ $or: [ { 'senderID': ?0 }, { 'receiverID': ?0 } ] }")
    List<Message> findAllUserMessages(String userID, org.springframework.data.domain.Sort sort);
}