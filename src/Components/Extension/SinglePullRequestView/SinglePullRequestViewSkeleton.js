import React from 'react';
import styled from 'styled-components';
import Skeleton from '@mui/material/Skeleton';

const SkeletonFlex = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    top: 50px;
`;

const ButtonSpan = styled.span`
    margin-top: 40px;
`;

const SmallTextSpan = styled.span`
    margin-top: 20px;
`;

export default function SkeletonPermissions() {

    return (   
    <SkeletonFlex>
        <Skeleton animation="wave" variant="text" width={250} height={40} />
        <Skeleton animation="wave" variant="text" width={200} height={40} />
        <ButtonSpan>
            <Skeleton animation="wave" variant="rectangular" width={210} height={50} />
        </ButtonSpan>
    </SkeletonFlex>
    )
}
