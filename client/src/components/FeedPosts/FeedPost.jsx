import React, { useState, useEffect } from "react";
import { Box, Image, Divider, Button, useToast } from "@chakra-ui/react";
import { doc, updateDoc, deleteDoc, getDocs, collection } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import useAuthStore from "../../store/authStore";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";

const FeedPost = ({ post }) => {
  const [isDeleted, setIsDeleted] = useState(post.isDeleted || false);
  const [nsfwResult, setNsfwResult] = useState(null);
  const [textAnalysisResult, setTextAnalysisResult] = useState(null);
  const [report, setReport] = useState(null);
  const [adminIds, setAdminIds] = useState([]);
  const toast = useToast();
  const { user } = useAuthStore();
  const { userProfile } = useGetUserProfileById(post.createdBy);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchAdminIds = async () => {
      try {
        const adminSnapshot = await getDocs(collection(firestore, "admins"));
        const adminList = adminSnapshot.docs.map(doc => doc.data().uid);
        setAdminIds(adminList);
      } catch (error) {
        console.error("Error fetching admin IDs:", error);
      }
    };

    fetchAdminIds();
    
    if (user && adminIds.length > 0) {
      setIsAdmin(adminIds.includes(user.uid));
    }

    if (post?.imageURL) analyzeImageForNSFW();
    if (post?.caption) analyzeTextForSafety(post.caption);

  }, [post, user, adminIds]);

  useEffect(() => {
    if (isAdmin) fetchReports();
  }, [isAdmin]);

  const analyzeImageForNSFW = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/analyzeImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageURL: post.imageURL }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();
      setNsfwResult(result);
    } catch (error) {
      console.error("Error analyzing image:", error);
    }
  };

  const analyzeTextForSafety = async (caption) => {
    try {
      const response = await fetch("http://localhost:3000/api/analyzeText", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();
      setTextAnalysisResult(result.status);
    } catch (error) {
      console.error("Error analyzing text:", error);
    }
  };

  const fetchReports = async () => {
    try {
      const reportsSnapshot = await getDocs(collection(firestore, "reports"));
      const reports = reportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const matchedReport = reports.find(report => report.postId === post.id);
      if (matchedReport) {
        setReport(matchedReport);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const handleDeletePost = async () => {
    if (!isAdmin) return;
    setIsDeleted(true);

    try {
      await updateDoc(doc(firestore, "posts", post.id), { isDeleted: true });
      toast({
        title: "Post Deleted",
        description: "The post has been deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        description: "Failed to delete post.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleResolveReport = async () => {
    if (!isAdmin || !report) return;

    try {
   
      await deleteDoc(doc(firestore, "reports", report.id));
      setReport(null);

      toast({
        title: "Report Resolved",
        description: "This post has been marked as resolved.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error resolving report:", error);
      toast({
        description: "Failed to resolve the report.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box my={4} backgroundColor="white" borderRadius="8px" boxShadow="sm" p={4}>
      {isDeleted && (
        <Box position="absolute" top={0} left={0} right={0} bottom={0} backgroundColor="rgba(0, 0, 0, 0.6)" display="flex" alignItems="center" justifyContent="center" borderRadius="8px" zIndex={2}>
          <Box backgroundColor="rgba(244, 70, 70, 0.73)" p={3} borderRadius="8px" textAlign="center">
            <strong>This post has been deleted by admin!</strong>
          </Box>
        </Box>
      )}

      {!isDeleted || isAdmin ? (
        <>
          <PostHeader post={post} creatorProfile={userProfile} onDeleteClick={handleDeletePost} />
          <Divider my={2} borderColor="gray.300" borderWidth="0.9px" />
          {post.imageURL && <Image src={post.imageURL} alt="Feed Post" borderRadius={4} />}

          {isAdmin && report && (
            <Box mt={2} p={2} borderRadius="8px" backgroundColor="yellow.100">
              <strong>Reported for: {report.reason}</strong>
              <p>Reported by: {report.reportedBy}</p>
            
              {console.log("isAdmin:", isAdmin, "Report Exists:", report)}
              <Button colorScheme="blue" size="sm" mt={2} onClick={handleResolveReport}>
                Resolve Report
              </Button>
            </Box>
          )}

          {isAdmin && (
            <Box mt={2} p={2} borderRadius="8px" backgroundColor="gray.100">
              <p><strong>NSFW Report:</strong></p>
              <pre>{nsfwResult ? JSON.stringify(nsfwResult, null, 2) : "No NSFW data available"}</pre>
            </Box>
          )}

          {isAdmin && (
            <Box mt={2} p={2} borderRadius="8px" backgroundColor="red.100">
              <strong>⚠️ Caption Analysis:</strong>
              <p>{textAnalysisResult === "warning" ? "This caption may contain inappropriate content." : "Text content safe."}</p>
            </Box>
          )}

          <PostFooter post={post} />
        </>
      ) : null}
    </Box>
  );
};

export default FeedPost;








/*
SHOWS ALL POSTS TO ADMIN- 

import React, { useState, useEffect } from "react";
import { Box, Image, Divider, useToast } from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebase";
import useAuthStore from "../../store/authStore";
import useGetUserProfileById from "../../hooks/useGetUserProfileById";
import PostFooter from "./PostFooter";
import PostHeader from "./PostHeader";

const FeedPost = ({ post }) => {
  const [isDeleted, setIsDeleted] = useState(post.isDeleted);
  const [nsfwResult, setNsfwResult] = useState(null);
  const { user } = useAuthStore();
  const { userProfile } = useGetUserProfileById(post.createdBy);
  const toast = useToast();
  
  const adminIds = [
    "gt7OmgBo3PVjA66wxR4RIcn8S903",
    "qRJh7BK68vZyEqGZ2xBgyQ1F4hv1",
    "vFJJwtvSscW6EhwsXVXZ5vt1WQ93",
    "Spoqe5vW3MO9y4vOEqyYembfzgP2",
    "M0w3z6AvX8ZIziyNPlV0n24I5RI3"
  ];
  const isAdmin = user && adminIds.includes(user.uid);

  useEffect(() => {
    const analyzeImageForNSFW = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/analyzeImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageURL: post.imageURL }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setNsfwResult(result);
      } catch (error) {
        console.error("Error analyzing image:", error);
      }
    };

    if (post?.imageURL) {
      analyzeImageForNSFW();
    }
  }, [post]);

  const handleDeletePost = async () => {
    if (!isAdmin) return;
    setIsDeleted(true);

    try {
      const postRef = doc(firestore, "posts", post.id);
      await updateDoc(postRef, { isDeleted: true });
      toast({
        title: "Post Deleted",
        description: "The post has been deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        description: "Ensure your content is safe.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box my={4} backgroundColor="white" borderRadius="8px" boxShadow="sm" p={4}>
      {isDeleted && (
        <Box position="absolute" top={0} left={0} right={0} bottom={0} backgroundColor="rgba(0, 0, 0, 0.6)" display="flex" alignItems="center" justifyContent="center" borderRadius="8px" zIndex={2}>
         
            <strong>This post has been deleted by admin!</strong>
          </Box>
        </Box>
      )}
      {!isDeleted || isAdmin ? (
        <>
          <PostHeader post={post} creatorProfile={userProfile} onDeleteClick={handleDeletePost} />
          <Divider my={2} borderColor="gray.300" borderWidth="0.9px" />
          <Image src={post.imageURL} alt="Feed Post" borderRadius={4} />
          {nsfwResult && isAdmin && (
            <Box mt={2} p={2} borderRadius="8px" backgroundColor="gray.100">
              <p><strong>NSFW Report:</strong></p>
              <pre>{JSON.stringify(nsfwResult, null, 2)}</pre>
            </Box>
          )}
          <PostFooter post={post} />
        </>
      ) : null}
    </Box>
  );
};

export default FeedPost;



*/

