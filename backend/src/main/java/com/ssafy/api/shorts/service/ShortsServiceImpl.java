package com.ssafy.api.shorts.service;

import com.ssafy.api.file.service.FileService;
import com.ssafy.api.shorts.request.ShortsPostReq;
import com.ssafy.db.entity.*;
import com.ssafy.db.repository.NotificationRepository;
import com.ssafy.db.repository.ShortsDislikeRepository;
import com.ssafy.db.repository.ShortsLikeRepository;
import com.ssafy.db.repository.ShortsRepository;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Service("shortsService")
public class ShortsServiceImpl implements  ShortsService {
    @Autowired
    FileService fileService;

    @Autowired
    ShortsRepository shortsRepository;

    @Autowired
    ShortsLikeRepository shortsLikeRepository;

    @Autowired
    ShortsDislikeRepository shortsDislikeRepository;
    @Autowired
    NotificationRepository notificationRepository;

    //지원하는 동영상 확장자 ArrayList
    String[] supportedVideoExtension = {"MKV", "MP4", "AVI"};

    boolean isValidVideoExtension(String extension) {
        for(String s : supportedVideoExtension) {
            if(extension.equals(s.toUpperCase()) || extension.equals(s.toLowerCase())) {
                return true;
            }
        }
        return false;
    }

    @Override
    public int uploadShorts(Shorts shorts, MultipartFile multipartFile, ShortsPostReq shortsPostReq) {
        String extension = FilenameUtils.getExtension(multipartFile.getOriginalFilename());                            //클라이언트가 업로드한 파일의 확장자 추출

        //1. 지원하는 비디오 확장자인지 검사
        if(!isValidVideoExtension(extension)) {
            return 415; //Not Supported Type
        }

        //2. Amazon S3에 동영상 업로드
        com.ssafy.db.entity.File file = fileService.saveFile(multipartFile, shortsPostReq.getFileDescription());

        //3. file 테이블에 관련 정보 저장
        file = fileService.addTableRecord(file);

        //4. shorts VO 설정
        shorts.setComment(shortsPostReq.getFileDescription());
        shorts.setShortsPathFileIdx(file);

        //5. shorts 테이블에 관련 정보 저장
        shortsRepository.save(shorts);

        //6. 정상 업로드: 200 리턴
        return 200;
    }

    @Override
    public com.ssafy.db.entity.File getFileInstanceByShortsIdx(Long shortsIdx) {
        return shortsRepository.findByShortsIdx(shortsIdx).get().getShortsPathFileIdx();
    }

    @Override
    public void setShortsLike(User user, Long shortsId) {
        Shorts shorts = shortsRepository.getOne(shortsId);
        ShortsLike shortsLike = new ShortsLike();
        shortsLike.setUserIdx(user);
        shortsLike.setShortsIdx(shorts);
        shortsLikeRepository.save(shortsLike);

        User getAlarmUser = shortsRepository.findByShortsIdx(shortsId).get().getUserIdx();

        Notification notification = new Notification();
        notification.setUserIdx(getAlarmUser);    //알람을 받을 사용자; User 객체 타입
        notification.setAlarmContent(getAlarmUser.getNickname()+"님이 당신의 쇼츠 "+ shorts.getComment() +" 에 좋아요를 눌렀습니다.");
        notification.setChecked(false);
        notification.setAlarmDate(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    @Override
    public void setShortsDislike(User user, Long shortsId) {
        Shorts shorts = shortsRepository.getOne(shortsId);
        ShortsDislike shortsDislike = new ShortsDislike();
        shortsDislike.setUserIdx(user);
        shortsDislike.setShortsIdx(shorts);
        shortsDislikeRepository.save(shortsDislike);
    }
}
