import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Card, Avatar, Typography } from 'antd';

import { IStoredLink } from 'apollo/types/graphql-types';
import { getDisplayName } from 'utils/userUtils';
import { MiddledotIcon } from 'utils/iconUtils';

const { Text } = Typography;
const { Meta } = Card;

interface ILinkCard {
  storedLink: IStoredLink
}

const StyledCard = styled(Card)`
  .ant-card-meta-title > a {
    color: #2F3640;
  }
  .ant-avatar {
    border-radius: 4px;
    width: 6.25rem;
    height: 6.25rem;
    border: 1px solid #e8e8e8;
    img {
      border-radius: 4px;
    }
  }
`;

const LinkCard: React.FC<ILinkCard> = ({ storedLink }) => {
  const { link, category, sharedBy } = storedLink;
  return (
    <StyledCard className="w-100">
      <Meta
        avatar={
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Avatar src={link.image} />
          </a>          
        }
        title={
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.title}
          </a>
        }
        description={(
          <>
            <Text type="secondary">{link.description}</Text>
            <div className="mt-4">
              <a href="#!">{category.keyword}</a>
              <span className="mx-3">
                <MiddledotIcon />
              </span>
              <Link
                to={`/profile/${sharedBy.memberId}`}
                className="text-muted"
              >
                Shared by {getDisplayName(sharedBy)}
              </Link>
            </div>
          </>
        )}
      />
    </StyledCard>
  );
}

export default LinkCard;