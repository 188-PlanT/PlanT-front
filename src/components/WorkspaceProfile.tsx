import AppColor from '@styles/AppColor';
import styled from '@emotion/styled';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface WorkspaceProfileProps {
  workspaceId?: number;
  workspaceName: string;
  imageUrl?: string;
  isMine?: boolean;
}

export default function WorkspaceProfile({workspaceId, workspaceName, imageUrl, isMine = false}: WorkspaceProfileProps) {
  const router = useRouter();
  
  const [isFocused, setIsFocused] = useState(false);
  
  useEffect(() => {
    if (isMine && router.pathname.includes('/workspace/personal')) {
      setIsFocused(true);
      return;
    }
    if (router.query.workspaceId && workspaceId && router.query.workspaceId === String(workspaceId)) {
      setIsFocused(true);
      return;
    }
    setIsFocused(false);
  }, [isMine, router, workspaceId]);

  return (
    <Link href={`/workspace/${isMine ? 'personal' : workspaceId}`}>
      <Container style={{...(isFocused && {borderRadius: '10px', backgroundColor: AppColor.main})}}>
        {imageUrl ? (
          <Image 
            src={imageUrl}
            alt={`${workspaceName}의 워크스페이스 이미지`}
            width='50px'
            height='50px'
          />
        ) : (
            <FirstLetter style={{...(isFocused && {color: AppColor.etc.white})}}>{workspaceName[0]}</FirstLetter>
          ) 
        }
      </Container>
    </Link>
  )
}

const Container = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 100%;
  background-color: ${AppColor.background.gray};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`

const FirstLetter = styled.p`
  font-weight: bold;
  font-size: 24px;
  color: ${AppColor.text.signature};
`